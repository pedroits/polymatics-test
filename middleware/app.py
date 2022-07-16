import os
import requests
from flask import Flask, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

NAME = os.getenv('SHOPIFY_NAME', '')
TOKEN = os.getenv('SHOPIFY_TOKEN', '')

URL = 'https://{}.myshopify.com/admin/api/2022-07/products.json?limit=50'.format(NAME)
HEADERS = { 'X-Shopify-Access-Token': TOKEN }

def get_pagination_info(link):
    prev_page = None
    next_page = None

    if len(link.split('https://')) > 2:
        for l in link.split(';'):
            if 'https://' in l:
                if 'rel=' in l:
                    next_page = l.split('<')[1].split('>')[0].split('page_info=')[1]
                else:
                    prev_page = l.replace('<', '').replace('>', '').split('page_info=')[1]
    else:
        page_info = link.split(';')[0].replace('<', '').replace('>', '').split('page_info=')[1]
        if 'rel="next"' in link:
            next_page = page_info
        else:
            prev_page = page_info

    return {
        'next': next_page,
        'prev': prev_page
    }

@app.route('/')
def fetch_product():
    page_info = request.args.get('pageInfo', None)
    url = URL+'&page_info='+page_info if page_info else URL

    response = requests.get(url, headers=HEADERS)
    pagination = get_pagination_info(response.headers['Link'])

    return {
        'products': response.json()['products'],
        'nextPage': pagination['next'],
        'prevPage': pagination['prev'],
    }
