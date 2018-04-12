#!/usr/bin/env python
# Name: Amerens Jongsma
# Student number: 10735666
# sources: BeautifulSoup documentation and "Web Scraping with Python and BeautifulSoup"
# https://www.dataquest.io/blog/web-scraping-beautifulsoup/
"""
This script scrapes IMDB and outputs a CSV file with highest rated tv series.
"""

import csv
import re
from requests import get
from requests.exceptions import RequestException
from contextlib import closing
from bs4 import BeautifulSoup
import pandas as pd
import itertools

TARGET_URL = "http://www.imdb.com/search/title?num_votes=5000,&sort=user_rating,desc&start=1&title_type=tv_series"
BACKUP_HTML = 'tvseries.html'
OUTPUT_CSV = 'tvseries.csv'

def extract_tvseries(dom):
    """
    Extract a list of highest rated TV series from DOM (of IMDB page).
    Each TV series entry should contain the following fields:
    - TV Title
    - Rating
    - Genres (comma separated if more than one)
    - Actors/actresses (comma separated if more than one)
    - Runtime (only a number!)
    """

    response = get(TARGET_URL)
    souped = BeautifulSoup(response.text, 'html.parser')
    type(souped)

    # Lists to store the scraped data in
    names = []
    rating = []
    genres = []
    actors = []
    runtimes = []
    complete_series_list = []

    series = souped.find_all('div', class_ = 'lister-item mode-advanced')

    # printing the amount of series on the webpage
    print('The amount of series on the webpage is {}.'.format(len(series)))

    # iterate over all series and collect data
    for serie in series:
        # name
        serie_name = serie.h3.a.text
        names.append(serie_name)

        # rating
        serie_rating = serie.strong.text
        rating.append(serie_rating)

        # genres
        serie_genre = serie.p.find('span', class_ = 'genre').get_text("|", strip=True)
        genres.append(serie_genre)

        # actors
        full_content = serie.find('div', class_ = 'lister-item-content')
        actors_link = full_content.find_all("a", href=re.compile("name"))

        actors_in_serie = ''
        for actor in actors_link:
            if actors_in_serie == '':
                actors_in_serie += actor.string
            else:
                actors_in_serie += ', ' + actor.string

        actors.append(actors_in_serie)

        # runtime
        serie_runtime = serie.p.find('span', class_ = 'runtime').text

        # deleting all other letter (min.) to be only left with the number
        serie_runtime2 = int(re.sub('[^0-9]', '', serie_runtime))
        runtimes.append(serie_runtime2)

    # combining all obtained data in one list
    complete_series_list = list(zip(names, rating, genres, actors, runtimes))

    return complete_series_list


def save_csv(outfile, tvseries):
    """
    Output a CSV file containing highest rated TV-series.
    """

    writer = csv.writer(outfile)

    # 'uncomment' the following line, if you want to run this in excel
    # writer.writerow(['sep=,'])

    # row with headers
    writer.writerow(['Title', 'Rating', 'Genre', 'Actresses/actors', 'Runtime'])

    # write in each row the data of a series
    for serie in tvseries:
        writer.writerow(serie)


def simple_get(url):
    """
    Attempts to get the content at `url` by making an HTTP GET request.
    If the content-type of response is some kind of HTML/XML, return the
    text content, otherwise return None
    """
    try:
        with closing(get(url, stream=True)) as resp:
            if is_good_response(resp):
                return resp.content
            else:
                return None
    except RequestException as e:
        print('The following error occurred during HTTP GET request to {0} : {1}'.format(url, str(e)))
        return None


def is_good_response(resp):
    """
    Returns true if the response seems to be HTML, false otherwise
    """
    content_type = resp.headers['Content-Type'].lower()
    return (resp.status_code == 200
            and content_type is not None
            and content_type.find('html') > -1)


if __name__ == "__main__":

    # get HTML content at target URL
    html = simple_get(TARGET_URL)

    # save a copy to disk in the current directory, this serves as an backup
    # of the original HTML, will be used in grading.
    with open(BACKUP_HTML, 'wb') as f:
        f.write(html)

    # parse the HTML file into a DOM representation
    dom = BeautifulSoup(html, 'html.parser')

    # extract the tv series (using the function you implemented)
    tvseries = extract_tvseries(dom)

    # write the CSV file to disk (including a header)
    with open(OUTPUT_CSV, 'w', newline='') as output_file:
        save_csv(output_file, tvseries)
