var express	= require('express');
var router 	= express.Router();
var mongojs	= require('mongojs');
var db 		= mongojs('mongodb://admin:admin@ds059195.mlab.com:59195/mean-tasklist',['tasks']);

// Get all tasks
router.get('/tasks', function(request, response, next){
		console.log("get all");

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
		console.log("get single");

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
		console.log("save");

	var task = request.body;
	if(!task.title || !(task.isDone + '')){
		response.status(400);
		response.json({
			"error":"Bad Data"
		})
	} else {
		db.tasks.save(task, function(err, task){
			if(err){
				response.send(err);
			}  else {
				response.json(task);
			}

		});
	}
});

// Delete a Task
router.delete('/task/:id', function(request, response, next){
		console.log("delete");

	db.tasks.remove({_id: mongojs.ObjectId(request.params.id)}, function(err,task){
		if(err){
			response.send(err);
		}  else {
			response.json(task);
		}
	});
});

// Update Task
router.put('/task/:id', function(request, response, next){
	
	var task = request.body;
	var updatedTask = {};

	if(task.isDone){
		console.log("there is isDone");
		updatedTask.isDone = task.isDone;
	} else {
		updatedTask.isDone = false;
	};

	if(task.title){
		console.log("there is a title");
		updatedTask.title = task.title;
	}

	if(!updatedTask){
		console.log('error')
		response.status(400);
		response.json({
			"error":"nothing to update!"
		})
	} else {
		console.log("route task is " , updatedTask)
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