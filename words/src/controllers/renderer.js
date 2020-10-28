/**
 * @fileoverview Showdown renderer
 * @description Converts markdown to HTML dynamically and renders it
 */

const express = require("express");
const showdown = require("showdown");

const renderer = new showdown.Converter();
