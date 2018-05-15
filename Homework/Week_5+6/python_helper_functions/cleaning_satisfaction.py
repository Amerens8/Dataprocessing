# cleaninghapp.py
#
# Amerens Jongsma
#
# specific function to clean up and select only necessary data from csv file
# in the end the output only contains data of the Happiness score of
# countries in Southeast Asia

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

    # print(data)

    for row in data:
        location = row[0]
        country = row[1]
        score = row[14]
        countries_satisfaction.append([location, country, score])
    first_row = (data[0][0], data[0][1], data[0][14])
    print(countries_satisfaction)
    with open(clean_csvfile, 'w') as outfile:
        writer = csv.writer(outfile)
        x = 0
        writer.writerow(first_row)
        for x in range(1, len(countries_satisfaction)):
            writer.writerow(countries_satisfaction[x])
            x += 1

#  this function was applied to the following datasets
cleaning_satisfaction('BLIsatisf17.csv', 'clean_BLIsatisf17.csv')
