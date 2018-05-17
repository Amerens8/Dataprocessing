# cleaning_indicators.py
#
# Amerens Jongsma
#
# specific function to clean up and select only necessary data from csv file


import csv
import json
import sys


def cleaning_indicators(csvfile, clean_csvfile):
    data = []
    countries_indicators = []
    countries_values = []
    employment = []
    education = []
    water = []
    voter = []
    long_hours = []
    complete = []
    csv_file = open(csvfile, "r")

    for row in csv_file:
        splitted = row.split(',')
        data.append(splitted)

    for row in data:
        location = row[0]
        country = row[1]
        score = row[14]
        countries_indicators.append([location, country, score])
        countries_values.append([score])

    # print(countries_values)

    first_row = ('code', 'country', 'safe', 'employment', 'education', 'water', 'voter')
    # print(countries_indicators)
    with open(clean_csvfile, 'w') as outfile:
        writer = csv.writer(outfile)
        x = 0
        writer.writerow(first_row)

        for x in range(40, 78):
            value = countries_values[x]
            employment.append(countries_values[x])
            x += 1
        # print(employment)
        for x in range(79, 117):
            value = countries_values[x]
            education.append(countries_values[x])
            x += 1

        for x in range(118, 156):
            value = countries_values[x]
            water.append(countries_values[x])
            x += 1
        for x in range(157, 195):
            value = countries_values[x]
            voter.append(countries_values[x])
            x += 1
        # for x in range(196, 234):
        #     value = countries_values[x]
        #     long_hours.append(countries_values[x])
        #     x += 1
        x = 0
        for x in range(0, 38):
            complete_line = countries_indicators[x + 1] + employment[x] + education[x] + water[x] + voter[x]
            # print(complete_line)
            complete.append(complete_line)
            x += 1
        print(complete)

        for x in range(0, 38):
            writer.writerow(complete[x])
            x += 1

#  this function was applied to the following dataset
cleaning_indicators('BLIindicators17.csv', 'clean_BLIindicators17.csv')
