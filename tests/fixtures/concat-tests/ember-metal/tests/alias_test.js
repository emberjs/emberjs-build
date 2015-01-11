// jshint ignore: start
import alias from "ember-metal/alias";
import { defineProperty } from "ember-metal/properties";
import { get } from 'ember-metal/property_get';
import { set } from 'ember-metal/property_set';
import { meta } from 'ember-metal/utils';
import { isWatching } from "ember-metal/watching";
import { addObserver, removeObserver } from "ember-metal/observer";

QUnit.module('ember-metal/alias');

test('should proxy get to alt key');
