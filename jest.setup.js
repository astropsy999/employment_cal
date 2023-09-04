import { TextEncoder, TextDecoder } from 'util';
import { JSDOM } from 'jsdom';

Object.assign(global, { TextDecoder, TextEncoder });

const dom = new JSDOM('<!doctype html><html><body></body></html>');

global.TextEncoder = require('text-encoding-utf-8').TextEncoder;
global.TextDecoder = require('text-encoding-utf-8').TextDecoder;
global.document = dom.window.document;
global.window = dom.window;
global.navigator = dom.window.navigator;
