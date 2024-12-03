import argparse
import base64
import json
import os
from urllib.request import urlopen


def image_url_to_base64_string(image_url: str) -> str:
    image_data = urlopen(image_url).read()
    encoded_data = base64.b64encode(image_data)
    result = encoded_data.decode('ascii')
    return result


if __name__ == '__main__':
    input_file  = os.path.join(__file__, '..', 'in.json')
    input_file = os.path.abspath(input_file)

    output_file = os.path.join(__file__, '..', 'out.json')
    output_file = os.path.abspath(output_file)

    with open(input_file, 'rt') as f:
        data = json.loads(f.read())

    output = []
    for i, item in enumerate(data):
        print(i)
        image_url = item['image_url']
        try:
            base64_string = image_url_to_base64_string(image_url)
            item['base64'] = base64_string
        except:
            print('FAILED: ' + item['title'] + ' ' + image_url)
            item['base64'] = ''
        del item['image_url']
        output.append(item)
    
    with open(output_file, 'wt') as f:
        f.write(json.dumps(output, indent=4))