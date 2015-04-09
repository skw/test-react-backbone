/*
 * React.js Starter Kit
 * Copyright (c) 2014 Konstantin Tarkus (@koistya), KriaSoft LLC.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

'use strict';

import 'babel/polyfill';
import _ from 'lodash';
import $ from 'jquery';
import Backbone from 'backbone';
import React from 'react/addons';
import FastClick from 'fastclick';
import emptyFunction from 'react/lib/emptyFunction';
import App from './components/App';
import Dispatcher from './core/Dispatcher';
import AppActions from './actions/AppActions';
import ActionTypes from './constants/ActionTypes';


var ItemView = React.createClass({
  render: function() {
    return (
      <li class="song-row" key={this.props.data.id}>
        <img src={this.props.data.img} />
        {this.props.data.name}
      </li>
    );
  }
});

var ListView = React.createClass({
  render: function() {
    return (
      <ul class="song-rows">
        {this.props.data.map(function(result) {
          return <ItemView data={result} />
        })}
      </ul>
    );
  }
});

var TestView = Backbone.View.extend({
  tagName: 'section',

  events: {
    "click #sort-it": "sortHandler"
  },

  initialize: function () {
    console.log('initialize');
  },

  sortHandler: function() {
    if (_.has(this, 'collection') === false) {
      return false;
    }

    this.collection.comparator = function(modelA, modelB) {
      return modelB.get('name').length - modelA.get('name').length;
    };
    this.collection.sort();
  },

  setData: function(data) {
    this.collection = new Backbone.Collection(data);

    this.listenTo(this.collection, 'sort', this.onRender);
  },

  render: function() {
    this.$el.html('<h1>Testing</h1><button id="sort-it">SORT</button><div id="container"></div>');

    this.onRender();

    return this;
  },

  serializeData: function() {
    let data = this.collection.toJSON();

    return data;
  },

  onRender: function() {
    let data = this.serializeData();

    console.log('data', data)

    React.render(<ListView data={data} />,  document.getElementById('container'));
  }
});


function run() {

  var data = [
    {
      id: 0,
      name: 'c',
      img: 'https://s3.amazonaws.com/muzooka-prod/bands/995/avatar.jpg',

    },
    {
      id: 1,
      name: 'aaa',
      img: 'https://s3.amazonaws.com/muzooka-prod/bands/995/avatar.jpg'
    },
    {
      id: 2,
      name: 'bb',
      img: 'https://s3.amazonaws.com/muzooka-prod/bands/995/avatar.jpg'
    },
  ]

  var testView = new TestView;
  testView.setData(data);

  $('body').append(testView.$el);
  testView.render();
}

Promise.all([
  new Promise((resolve) => {
    if (window.addEventListener) {
      window.addEventListener('DOMContentLoaded', resolve);
    } else {
      window.attachEvent('onload', resolve);
    }
  })
]).then(run);
