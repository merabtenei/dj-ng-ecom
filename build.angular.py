import os
import subprocess
import shutil
import re

os.chdir('./angular')
subprocess.call('ng build --aot --prod --output-hashing=all --output-path ../static/ng --base-href "/"', shell=True)
os.chdir('..')

new_content = ''
with open('static/ng/index.html', 'r' ) as fin:
    content = fin.read()
    
    new_content = re.sub(r'href="(.+?\..+?)"', r'''href="{% static 'ng/\1' %}"''', content)
    new_content = re.sub(r'src="(.+?\..+?)"', r'''src="{% static 'ng/\1' %}"''', new_content)
    new_content = '{% load static %}\n' + new_content

if(new_content):
    with open('static/ng/index.html', 'w') as fout:
        
        fout.write(new_content)
