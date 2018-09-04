import Pusher from 'pusher-js';
import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

const API_URL = 'http://localhost:9000/api/';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      tasks: [],
      task: ''
    };
    this.updateText = this.updateText.bind(this);
    this.postTask = this.postTask.bind(this);
    this.deleteTask = this.deleteTask.bind(this);
    this.addTask = this.addTask.bind(this);
    this.removeTask = this.removeTask.bind(this);
    this.syncTasks = this.syncTasks.bind(this);
  }

  updateText(e) {
    this.setState({ task: e.target.value });
  }

  postTask(e) {
    e.preventDefault();
    if (!this.state.task.length) {
      return;
    }
    const newTask = {
      task: this.state.task
    };
    fetch(API_URL + 'new', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newTask)
    }).then(console.log);
  }

  syncTasks() {
    fetch(API_URL)
    .then(function(response) {
     return response.json()
   }).then(body => {
     console.log('body' + body);
     this.setState({ tasks: body })
   });
  }

  deleteTask(id) {
    fetch(API_URL + id, {
      method: 'delete'
    }).then(console.log);
  }

  addTask(newTask) {
    this.setState(prevState => ({
      tasks: prevState.tasks.concat(newTask),
      task: ''
    }));
  }

  removeTask(id) {
    this.setState(prevState => ({
      tasks: prevState.tasks.filter(el => el.id !== id)
    }));
  }

  componentDidMount() {
    this.syncTasks();
    this.pusher = new Pusher(process.env.REACT_APP_PUSHER_APP_KEY, {
          cluster: process.env.REACT_APP_PUSHER_APP_CLUSTER,
      encrypted: true,
    });
    this.channel = this.pusher.subscribe('tasks');

    this.channel.bind('inserted', this.addTask);
    this.channel.bind('deleted', this.removeTask);
  }

  render() {
    let tasks = this.state.tasks.map(item =>
      <Task key={item.id} task={item} onTaskClick={this.deleteTask} />
    );

    return (
      <div className="todo-wrapper">
        <form>
          <input type="text" className="input-todo" placeholder="New task" onChange={this.updateText} value={this.state.task} />
          <div className="btn btn-add" onClick={this.postTask}>+</div>
        </form>

        <ul>
          {tasks}
        </ul>
      </div>
    );
    }

}

class Task extends Component {
  constructor(props) {
    super(props);
    this._onClick = this._onClick.bind(this);
  }
  _onClick() {
    this.props.onTaskClick(this.props.task.id);
  }
  render() {
    return (
      <li key={this.props.task.id}>
        <div className="text">{this.props.task.task}</div>
        <div className="delete" onClick={this._onClick}>-</div>
      </li>
    );
  }
}

export default App;
