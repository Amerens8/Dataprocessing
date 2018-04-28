# convertCSV2JSON.py
# this function converts a CSV file to a JSON file

import csv
import json
import sys

# Reference (little help from): Quick CSV to JSON parser in python
# http://www.andymboyle.com/2011/11/02/quick-csv-to-json-parser-in-python/


def convertCSV2JSON(csvfile, jsonfile):
    opened_csv = open(csvfile, 'r')
    read = csv.reader(opened_csv)
    fieldnames = next(read)

    reader = csv.DictReader(opened_csv, fieldnames)
    out = json.dumps( [ row for row in reader ] )
    jsonfile = open(jsonfile, 'w')
    jsonfile.write(out)

convertCSV2JSON('clean_happ2015.csv', 'clean_happ2015.json')
