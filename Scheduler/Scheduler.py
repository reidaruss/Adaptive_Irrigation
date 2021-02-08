# Adaptive Irrigation Scheduler
# Author: Reid Russell
# Created: 02/08/2021
# Last Modified: 02/08/2021
# This is the base script for the main scheduler in the adaptive irrigation project for senior design.
# Many of the functions in this script will be spun off / consolidated into their own classes eventually.

# Imports
from pymongo import MongoClient
from bson.objectid import ObjectId

# Global Variables
connection_string = "mongodb+srv://readonly:readonly@[demodata.rgl39.mongodb.net/demo?retryWrites=true&w=majority](http://demodata.rgl39.mongodb.net/demo?retryWrites=true&w=majority)"
client = MongoClient(connection_string)


def get(post_id):
    post = client.db.posts.find_one({'_id': ObjectId(post_id)})
    title = post['title']


    # Send new data to database
def update_db(message):
    print("Updating MongoDB...")