import os
from django.conf import settings
from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from sklearn.preprocessing import MinMaxScaler
from sklearn.metrics import mean_squared_error, r2_score
from .serializers import StockPredictionSerializer
import yfinance as yf
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import sklearn.preprocessing as sk
import tensorflow as tf
from datetime import datetime
from .utils import save_plot


# Create your views here.
class StockPredictionAPIView(APIView):
    def post(self, request):
        now = datetime.now()
        start = datetime(now.year-10, now.month, now.day)
        end = now
        serializer = StockPredictionSerializer(data=request.data)
        if serializer.is_valid():
            ticker = serializer.validated_data['ticker']    
            try:
                df = yf.download(ticker, start, end)
                if df.empty:
                    return Response(
                            {'error': 'Invalid ticker or no data available for the specified ticker.',
                                'status': status.HTTP_404_NOT_FOUND})
                
                df= df.reset_index()
                df_cop = df.copy()
                df_cop.columns.names = [None, None]
                df_cop.columns = [' '.join(col).strip() if isinstance(col, tuple) else col for col in df_cop.columns]
                # if isinstance(df_cop.columns, pd.MultiIndex):
                #     df_cop.columns = df_cop.columns.droplevel(1)

                print(df_cop)

                # Generate a basic plot
                plt.switch_backend('Agg')  # Use a non-interactive backend for plotting (AGG=Anti-Grain Geometry)
                plt.figure(figsize=(12,5));
                plt.plot(df_cop[f'Close {ticker}'], label='Close Price');
                plt.title(f"Closing Price of {ticker}");
                plt.xlabel('Days');
                plt.ylabel('Close Price');
                plt.legend();

                #Save the plot to the media directory
                plot_img_path = f'{ticker}_plot.png'  # Give a name to the plot
                plot_img = save_plot(plot_img_path)

                # 100 day moving average
                df_cop['MA_100'] = df_cop[f'Close {ticker}'].rolling(100).mean()
                plt.switch_backend('Agg')  # Use a non-interactive backend for plotting (AGG=Anti-Grain Geometry)
                plt.figure(figsize=(12,5));
                plt.plot(df_cop[f'Close {ticker}'], label='Close Price');
                plt.plot(df_cop['MA_100'], 'r', label='100 Days Moving Average');
                plt.title(f"Closing Price vs 100 Days Moving Average of {ticker}");
                plt.xlabel('Days');
                plt.ylabel('Close Price');
                plt.legend();

                plot_img_path_100 = f'{ticker}_100_plot.png'  # Give a name to the plot
                dma_100_img = save_plot(plot_img_path_100)

                # 200 day moving average
                df_cop['MA_200'] = df_cop[f'Close {ticker}'].rolling(200).mean()
                plt.switch_backend('Agg')  # Use a non-interactive backend for plotting (AGG=Anti-Grain Geometry)
                plt.figure(figsize=(12,5));
                plt.plot(df_cop[f'Close {ticker}'], label='Close Price');
                plt.plot(df_cop['MA_100'], 'r', label='100 Days Moving Average');
                plt.plot(df_cop['MA_200'], 'g', label='200 Days Moving Average');
                plt.title(f"Closing Price vs 200 Days Moving Average of {ticker}");
                plt.xlabel('Days');
                plt.ylabel('Close Price');
                plt.legend();

                plot_img_path_200 = f'{ticker}_200_plot.png'  # Give a name 
                dma_200_img = save_plot(plot_img_path_200)


                # Splitting data into tarining and testing dataset
                training_data = pd.DataFrame(df_cop[f'Close {ticker}'][0:int(len(df_cop) * 0.7)])
                testing_data = pd.DataFrame(df_cop[f'Close {ticker}'][int(len(df_cop) * 0.7): int(len(df_cop))])

                scaler = MinMaxScaler(feature_range=(0,1))

                # Load ML Model
                model = tf.keras.models.load_model('stock_predictions_model.keras')

                # Prepare test data
                past_100_days = training_data.tail(100)
                final_testing_data = pd.concat([past_100_days, testing_data], ignore_index=True)
                final_testing_data_array = scaler.fit_transform(final_testing_data)

                x_test = []
                y_test = []

                for i in range(100, final_testing_data_array.shape[0]):
                    x_test.append(final_testing_data_array[i-100: i])
                    y_test.append(final_testing_data_array[i,0])

                
                x_test, y_test = np.array(x_test), np.array(y_test)


                # Make Predictions
                y_predicted = model.predict(x_test)

                # Inverse transform the predicted values
                # scale_factor = 1/scaler.scale_[0]
                # y_predicted = y_predicted * scale_factor
                # y_test = y_test * scale_factor
                y_predicted = scaler.inverse_transform(y_predicted.reshape(-1,1)).flatten()
                y_test = scaler.inverse_transform(y_test.reshape(-1,1)).flatten()

                # Plot the predicted vs actual values
                plt.switch_backend('Agg')  # Use a non-interactive backend for plotting (AGG=Anti-Grain Geometry)
                plt.figure(figsize=(12,5));
                plt.plot(y_test, 'b', label='Actual Price');
                plt.plot(y_predicted, 'r', label='Predicted Price');
                plt.title(f"Actual vs Predicted Closing Price of {ticker}");
                plt.xlabel('Days');
                plt.ylabel('Close Price');
                plt.legend();

                plot_pred_img_path = f'{ticker}_predicted_plot.png'  # Give a name to the plot
                predicted_img = save_plot(plot_pred_img_path)


                # Model Evaluation
                mse = mean_squared_error(y_test, y_predicted)
                rse = np.sqrt(mse)
                r2 = r2_score(y_test, y_predicted)

                return Response({
                    'status': 'success',
                    'plot_img': plot_img,
                    'dma_100_img': dma_100_img,
                    'dma_200_img': dma_200_img,
                    'predicted_img': predicted_img,
                    'mse': mse,
                    'rse': rse,
                    'r2': r2
                })

            except Exception as e:
                print(f"Error fetching data for {ticker}: {e}")
                return Response({'error': 'Failed to fetch stock data.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            
            
