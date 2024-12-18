from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi

import copy

from bson.objectid import ObjectId

db='DEMONSTRATION'

input_types=[
            'text-input',
            'checkbox',
            'number-input',
            'select-input',
            'slider-input',
            'heart-rate-input',
            'time-input',
            'stopwatch',
            'green-detector'
            ,'movement-picker'
            ]   

class experiment_creator(object):

   def __init__(self,name,boxid,boxweek=0,**kwargs):

      self.uri = None

      self.doc = {
         '_id' : ObjectId(),
         'name' : name,
         'days' : [
            {
               'tasks' : [],
               'dayId' : ObjectId(),
               'disabled' : False,
               'description' : 'A description for the day.',
               'preconditions' : [],  
            }
         ],
         'boxId' : ObjectId(boxid),
         'preconditions' : [],
         'hidden' : False,
         'shouldSendReminders' : True,
         'boxweek' : boxweek,
         'desc' : [],
         'steps' : [],
         'tips' : [],
         **kwargs
      }

   def get_id(self):
      return self.doc['_id']

   def set_boxweek(self,boxweek):
      self.doc['boxweek']=boxweek

   def add_step(self,step,indexed=True,prepend=False):
      i=str(len(self.doc['steps'])+1)+'. '
      if indexed:
         step=i+step

      if prepend:
         self.doc['steps']=[step]+self.doc['steps']
      else:
         self.doc['steps'].append(step)

   def add_tip(self,tip):
      self.doc['tips'].append(tip)

   def add_task(self,name,icon='list-checks',typ='normal', **kwargs):
      task = {
         'name' : name,
         'icon' : icon,
         'blocks' : [],
         'taskId' : ObjectId(),
         'disabled' : False,
         'preconditions' : [],
         'type' : typ,
         **kwargs
      }

      self.doc['days'][0]['tasks'].append(task)

   def add_block(self, typ='para', task_ind=-1, in_expandable=False, in_description=False, **kwargs):

      block = {
         'blockId' : ObjectId(),
         'type' : typ,
         **kwargs
      }

      if typ in input_types:
         block['rk'] = 'rk'+str(len(self.doc['days'][0]['tasks'][task_ind]['blocks']))

      # in_expandable overrides everything; attempts to add the block as a child of the last instanced expandable
      if in_expandable:
         try:
            self.doc['desc'][self.expandable_cursor]['contents'].append(block)
         except NameError:
            raise ValueError('No expandable defined!')

      # Add the block to the description if no tasks are yet defined
      elif in_description or len(self.doc['days'][0]['tasks'])<1:
         self.doc['desc'].append(block)
      else:
         self.doc['days'][0]['tasks'][task_ind]['blocks'].append(block)


   def add_subblock(self, **kwargs):
      self.add_block(in_expandable=True, **kwargs)


   def add_expandable_description_block(self, title, summary=None):

      block = {
         'blockId' : ObjectId(),
         'type' : 'expandable',
         'title' : title,
         'contents' : [],
        'summary': summary
      }

      self.expandable_cursor = len(self.doc['desc'])
      self.doc['desc'].append(block)



   def add_context_to_task(self, task_ind=-1):
      self.add_block('title',task_ind=task_ind, content='For context...')
      self.add_block('select-input', task_ind=task_ind, label='When did you do this experiment today?', options=['Morning', 'Midday', 'Afternoon'])
      self.add_block('select-input', task_ind=task_ind, label='Where did you do this experiment today?', options=['At home', 'At work / uni', 'Somewhere else'])
      self.add_block('select-input', task_ind=task_ind, label='Who did you do this experiment with today?', options=['With myself only', 'With someone else'], help='We encourage you to do experiments with someone you know')
      self.add_block('select-input', task_ind=task_ind, label='Did you do this experiment indoors or outdoors today?', options=['Indoors','Outdoors'])
      self.add_block('text-input', label='Notes', optional=True)

   def add_reflection_task(self, reflection_text):
      self.add_task('Daily REFLECTion',typ='reflection',optional=True)
      self.add_block('text-input', label=reflection_text)

   def copy_days(self, seed_day=0, n_copies=1):
      for _ in range(n_copies):

         new_day = copy.deepcopy(self.doc['days'][seed_day])

         # Create new uids for tasks and blocks in the copy
         new_day['dayId'] = ObjectId()
         for t in range(len(new_day['tasks'])):
            new_day['tasks'][t]['taskId'] = ObjectId()
            for b in range(len(new_day['tasks'][t]['blocks'])):
               new_day['tasks'][t]['blocks'][b]['blockId'] = ObjectId()

         self.doc['days'].append(new_day)

   def autocomplete(self, reflection_text='', add_context=False):
      # Automatically adds context to all currently defined tasks, then adds a reflection task and make 4 copies of the day to fill out the week

      if add_context:
         for t in range(len(self.doc['days'][0]['tasks'])):
            self.add_context_to_task(task_ind=t)
      self.add_reflection_task(reflection_text)
      self.copy_days(seed_day=0, n_copies=4)

   def set_uri(self, uri):
      self.uri = uri

   def upload(self, uri=None):
      if uri==None:
         uri = self.uri
      if uri==None:
         try:
            ufile = open('uri.txt')
            uri = ufile.read().strip()
            ufile.close()
         except FileNotFoundError:
            raise NameError('Must provide a uri to upload to the database.  Either create a uri.txt file in this directory with the uri, add it to the experiment constructor instance with .set_uri, or pass it as an argument when running this upload function.')

      client = MongoClient(uri, server_api=ServerApi('1'))
      client.admin.command('ping')
      database = client[db]
      collection = database['experiments']

      b=collection.insert_one(self.doc)
      print(b)

      client.close()
