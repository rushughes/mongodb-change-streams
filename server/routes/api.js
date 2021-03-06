const Task  = require('../models/task');
const express = require('express');
const router = express.Router();


router.post('/new', (req, res) => {
  console.log('router.post /new', req.body.task);
     Task.create({
       name: req.body.name,
       task: req.body.task,
       type: req.body.type
     }, (err, task) => {
       if (err) {
         console.log('CREATE Error: ' + err);
         res.status(500).send('Error');
       } else {
         res.status(200).json(task);
       }
     });
   });

   router.delete('/:id', (req, res) => {
     Task.findById(req.params.id, (err, task) => {
       if (err) {
         console.log('DELETE Error: ' + err);
         res.status(500).send('Error');
       } else if (task) {
         task.remove( () => {
           res.status(200).json(task);
         });
      } else {
         res.status(404).send('Not found');
       }
     });
   });

   router.get('/', (req, res) => {
     console.log('get');
     Task.find({}, (err, task) => {
       if (err) {
         console.log('GET Error: ' + err);
         res.status(500).send('Error');
       } else if (task) {
         res.status(200).json(task);
       }
     });
   });

   module.exports = router;
