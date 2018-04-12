#!/usr/bin/env python
# Name: Amerens Jongsma
# Student number: 10735666
# 1
"""
This script scrapes IMDB and outputs a CSV file with highest rated tv series.
"""

import csv
import re
from requests import get
from requests.exceptions import RequestException
from contextlib import closing
from bs4 import BeautifulSoup

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
    # print(response.text[:1000])
    souped = BeautifulSoup(response.text, 'html.parser')
    type(souped)

    # Lists to store the scraped data in
    names = []
    rating = []
    genres = []
    actors = []
    runtimes = []

    series = souped.find_all('div', class_ = 'lister-item mode-advanced')
    print(type(series))
    print(len(series))

    #serie_actors = series[0].find_all('div', class_ = 'lister-item-content')
    serie_actors = series[0].find('div', class_ = 'lister-item-content')
    aas = serie_actors.find_all('<a href="name"/(.*?)'>)

    print(aas)
    print link.attrs['href']
    #for actor in aas:
    #    x = actor.find_all('<a href="name"/(.*?)>')
    #    print(x)
        #if actor.has_attr('href'):


        #    url_actor = re.find_all(pattern, actor)
        #    print(actor.attrs['href'])
        #    print(url_actor)



    for serie in series:
        # name
        serie_name = serie.h3.a.text
        names.append(serie_name)

        # rating
        serie_rating = float(serie.strong.text)
        rating.append(serie_rating)

        # genres
        serie_genre = serie.p.find('span', class_ = 'genre').get_text("|", strip=True)
        genres.append(serie_genre)

        # actors

        #join

        # runtime
        serie_runtime = serie.p.find('span', class_ = 'runtime')
        runtimes.append(serie_runtime.text)


    #print(names)
    #print(rating)
    #print(genres)
    #print(runtimes)




    # ADD YOUR CODE HERE TO EXTRACT THE ABOVE INFORMATION ABOUT THE
    # HIGHEST RATED TV-SERIES
    # NOTE: FOR THIS EXERCISE YOU ARE ALLOWED (BUT NOT REQUIRED) TO IGNORE
    # UNICODE CHARACTERS AND SIMPLY LEAVE THEM OUT OF THE OUTPUT.

    return []   # REPLACE THIS LINE AS WELL AS APPROPRIATE


def save_csv(outfile, tvseries):
    """
    Output a CSV file containing highest rated TV-series.
    """
    writer = csv.writer(outfile)
    writer.writerow(['Title', 'Rating', 'Genre', 'Actors', 'Runtime'])

    # ADD SOME CODE OF YOURSELF HERE TO WRITE THE TV-SERIES TO DISK


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
