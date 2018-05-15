# convertCSV2JSON.py
#
# Amerens Jongsma
#
# this function converts a CSV file to a JSON file in the right format
# Reference (little help from): Quick CSV to JSON parser in python
# http://www.andymboyle.com/2011/11/02/quick-csv-to-json-parser-in-python/

import csv
import json
import sys

def convertCSV2JSON(csvfile, jsonfile):
    opened_csv = open(csvfile, 'r')
    read = csv.reader(opened_csv)
    fieldnames = next(read)

    reader = csv.DictReader(opened_csv, fieldnames)
    out = json.dumps( [ row for row in reader ] )
    jsonfile = open(jsonfile, 'w')
    jsonfile.write(out)

#  this function was applied twice to the following csv files 
convertCSV2JSON('clean_happ2015.csv', 'clean_happ2015.json')
convertCSV2JSON('clean_happ2016.csv', 'clean_happ2016.json')
