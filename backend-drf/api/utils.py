import os
from django.conf import settings
import matplotlib.pyplot as plt

def save_plot(plot_img_path):
    # Save the plot to the media directory
    img_path = os.path.join(settings.MEDIA_ROOT, plot_img_path)
    plt.savefig(img_path)
    plt.close()  # Close the plot to free up memory
    img_url = settings.MEDIA_URL + plot_img_path
    return img_url
