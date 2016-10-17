var express	= require('express');
var router 	= express.Router();
var mongojs	= require('mongojs');
var db 		= mongojs('mongodb://admin:admin@ds059195.mlab.com:59195/mean-tasklist',['tasks']);

// Get all tasks
router.get('/tasks', function(request, response, next){
	db.tasks.find(function(err,tasks){
		if(err){
			response.send(err);
		}  else {
			response.json(tasks);
		}
	});
});

// Get Single Task
router.get('/tasks/:id', function(request, response, next){
	db.tasks.findOne({_id: mongojs.ObjectId(request.params.id)}, function(err,task){
		if(err){
			response.send(err);
		}  else {
			response.json(task);
		}
	});
});

// Save Tasks
router.post('/task', function(request, response, next){
	var task = request.body;
	if(!task.title || (task.isDone + '')===undefined){
	console.log(task.isDone + '')
		response.status(400);
		response.json({
			"error":"Bad Data"
		})
	} else {
		db.tasks.save(task, function(){
			if(err){
				response.send(err);
			}  else {
				response.json(task);
			}

		});
	}
});

// Delete a Task
router.delete('/tasks/:id', function(request, response, next){
	db.tasks.remove({_id: mongojs.ObjectId(request.params.id)}, function(err,task){
		if(err){
			response.send(err);
		}  else {
			response.json(task);
		}
	});
});

// Update Task
router.put('/tasks/:id', function(request, response, next){
	var task = request.body;
	var updatedTask = {};

	if(task.isDone){
		updatedTask.isDone = task.isDone;
	};

	if(task.title){
		updatedTask.title = task.title;
	}

	if(!updatedTask){
		response.status(400);
		response.json({
			"error":"nothing to update!"
		})
	} else {
		db.tasks.update({_id: mongojs.ObjectId(request.params.id)}, updatedTask, {}, function(err,task){
			if(err){
				response.send(err);
			}  else {
				response.json(task);
			}
		});		
	}


	
});

module.exports = router;