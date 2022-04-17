import cv2
import imutils
from imutils.object_detection import non_max_suppression
import numpy as np
import requests
import time
import base64
from urllib.request import urlopen

hog = cv2.HOGDescriptor()
hog.setSVMDetector(cv2.HOGDescriptor_getDefaultPeopleDetector())

# In[3]:
def detector(image):
   image = imutils.resize(image, width=min(400, image.shape[1]))
   clone = image.copy()
   rects, weights = hog.detectMultiScale(image, winStride=(4, 4), padding=(8, 8), scale=1.05)
   for (x, y, w, h) in rects:
       cv2.rectangle(image, (x, y), (x + w, y + h), (0, 0, 255), 2)
   rects = np.array([[x, y, x + w, y + h] for (x, y, w, h) in rects])
   result = non_max_suppression(rects, probs=None, overlapThresh=0.7)
   return result
def record(sample_time=5):
   print("recording")
   camera = cv2.VideoCapture(0)
   init = time.time()
   # ubidots sample limit
   if sample_time < 3:
       sample_time = 1
       
   while(True):
       ret, frame = camera.read()
       frame = imutils.resize(frame, width=min(400, frame.shape[1]))
       result = []
       result = detector(frame.copy())
       if hasattr(result,'__len__'):
           result1 = len(result)
           for (xA, yA, xB, yB) in result:
               cv2.rectangle(frame, (xA, yA), (xB, yB), (0, 255, 0), 2)
       else:
           result1 = 0
       saveToDataBase(result1)
       
   camera.release()
   cv2.destroyAllWindows()

def saveToDataBase(result):
    time.sleep(10)
    print(result)
    url = 'https://us-central1-presencedetection-4dcb0.cloudfunction.net/updateCount'
    myobj = {'roomID':'cbb122','count':result,'roomName':'CBB 122'}
    x = requests.post(url, data=myobj)
    print(x.text)

# In[7]:
def main():
   record()
# In[8]:
if __name__ == '__main__':
   main()