# Importing Image module from PIL package
from PIL import Image
import requests
 
# creating a image1 object and convert it to mode 'P'
im1 = Image.open("duplicate_detection.png").convert('RGBA')
 
# creating a image2 object and convert it to mode 'P'
im2 = Image.open("origin.png").convert('RGBA')
im2 = im2.resize(im1.size)
# alpha is 1.0, a copy of the second image is returned
im3 = Image.blend(im1, im2, 0.5)
 
# to show specified image
im3.show()