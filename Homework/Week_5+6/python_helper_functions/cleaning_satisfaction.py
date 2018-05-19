# cleaning_satisfaction.py
#
# Amerens Jongsma
#
# specific function to clean up and select only necessary data from csv file


import csv
import json
import sys


def cleaning_satisfaction(csvfile, clean_csvfile):
    data = []
    countries_satisfaction = []
    csv_file = open(csvfile, "r")

    for row in csv_file:
        splitted = row.split(',')
        data.append(splitted)

    for row in data:
        location = row[0]
        country = row[1]
        score = row[14]
        countries_satisfaction.append([location, country, score])
    first_row = ('code', 'country', 'score')

    with open(clean_csvfile, 'w') as outfile:
        writer = csv.writer(outfile)
        x = 0
        writer.writerow(first_row)
        for x in range(1, len(countries_satisfaction) -1):
            writer.writerow(countries_satisfaction[x])
            x += 1

#  this function was applied to the following dataset
cleaning_satisfaction('BLIsatisf16.csv', 'clean_BLIsatisf16.csv')
