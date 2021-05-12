# Adaptive Irrigation Scheduler
# Author: Reid Russell
# Created: 02/08/2021
# Last Modified: 02/08/2021
# This is the base script for the main scheduler in the adaptive irrigation project for senior design.
# Many of the functions in this script will be spun off / consolidated into their own classes eventually.

# Imports
from pymongo import MongoClient
from bson.objectid import ObjectId
import serial
from datetime import datetime
import pandas as pd

# Global Variables
connection_string = "mongodb://localhost:27017/"
client = MongoClient(connection_string)
db = client['sensor-data']
collection = db['moisture']


def get(post_id):
    post = client.db.posts.find_one({'_id': ObjectId(post_id)})
    title = post['title']


    # Send new data to database
def update_db(message):
    print("Updating MongoDB...")
    df = pd.DataFrame(message,columns=['Moisture','DT'])
    print(df)
    data = df.to_dict("records")
    collection.insert_many(data)

# Template for Mongo DB database
# {
#     date: '01/08/2021',
#     time: '18:00:00',
#     moisture_value: '436',
#     moisture_level: '85',
# }


class serialIO ():
    def __init__(self, baud):
        self.baud_rate = baud

# Yields messages from serial port (generator)
    def read_serial(self, serial_port):
        ser = serial.Serial(port=serial_port, baudrate=self.baud_rate)
        try:
            ser.isOpen()
            print("Serial Port is open.")
        except:
            print("Error opening serial port")
            exit()

        if ser.isOpen():
            try:
                while(1):
                    yield(ser.readline())
            except Exception:
                print("Error reading serial port")
        else:
            print("Cannot open serial port")

    def write_serial(self, serial_port, message):
        ser = serial.Serial(port=serial_port, baudrate=self.baud_rate)
        try:
            ser.isOpen()
            print("Serial Port is open.")
        except:
            print("Error opening serial port")
            exit()

        if ser.isOpen():
            try:
                while(1):
                    ser.write(message)
            except Exception:
                print("Error writing to serial port")
        else:
            print("Cannot open serial port")

def write_moisture_data(moisture):
    f = open("waterlog_test_1.txt", "a")
    for line in moisture:
        f.write(line)

def check_water_time():
    now = datetime.now()
    if now.minute % 2 == 0:
        return True
    else:
        return False



def start():
    #serial_port = '/dev/tty.usbmodem144101'

    serial_port = '/dev/tty.usbmodemL2000OAK1'
    baud = 9600
    # baud = 115200
    sIO = serialIO(baud)
    i = 0
    moisture = []
    big_list = []
    for line in sIO.read_serial(serial_port):
        # print(int.from_bytes(line[9:12],"big",signed="False"))
        # print(str(line[9:12],'UTF-8'))
        # moisture.append(line[9:12].decode("utf-8")+'\n')
        moisture.append(str(line[9:12],'UTF-8'))
        moisture.append(datetime.now())
        big_list.append(moisture)
        moisture = []
        i += 1

        # Experimental
#        if check_water_time():
#            sIO.write_serial("TTW:10")

        # End Experimental



        if i == 100:
            # write_moisture_data(moisture)
            update_db(big_list)
            i = 0
            big_list = []

start()