from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.options import Options
import json
import argparse

# 280,050 up to 15 letter, 283,714 up to 18 letters
def main(start, end, only):
  if only: 
    start = only
    end = only
  else:
    if start is None:
      start = 2
    if end is None: 
      end = 18

  if end - start > 6:
    are_you_sure = ''
    while are_you_sure.lower() != 'y' and are_you_sure.lower() != 'n':
      are_you_sure = input(f'Generating {end-start} word lists may take a while. Are you sure you wish to proceed? Y/N:\t')
      if are_you_sure.lower() == 'n':
        return

  

  PATH = "/mnt/c/Program Files (x86)/Google/Chrome/Application/chromedriver.exe"
  service = Service(PATH)
  options = Options()
  options.add_argument('--headless')
  driver = webdriver.Chrome(service=service, options=options)

  n_letter_words = {}

  base_url = 'https://www.wordunscrambler.net/words/'

  for i in range(start,end+1): 
      current_url = base_url + str(i) + '-letter'
      found_words = []
      page_num = 1
      while True:
          try:
              driver.get(current_url + '?page=' + str(page_num))
              wait = WebDriverWait(driver, 3)
              word_container = wait.until(EC.presence_of_all_elements_located(('xpath', '//ul[@id="word-list"]')))
              words = word_container[0].find_elements('xpath', '//span[@class="word-info"]')
              for word in words:
                  found_words.append(word.text)
              page_num = page_num + 1
          except Exception as e:
              break
      n_letter_words[i] = found_words
  
  driver.quit()

  for key, item in n_letter_words.items():
      with open('WordLists/' + str(key) + '-word-list.json', 'w') as json_file:
          json.dump(item, json_file)

if __name__ == "__main__":
  parser = argparse.ArgumentParser()
  parser.add_argument('--start', type=int, help='Length of smallest word list to generate. Default: 2')
  parser.add_argument('--end', type=int, help='Length of largest word list to generate. Default: 18')
  parser.add_argument('--only', type=int, help='Only generates a list of words of this length. Equivalent to --start = --end')
  args = parser.parse_args()
  main(start=args.start, end=args.end, only=args.only)