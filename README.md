Javascript Utility Code
=======================


event handling enhanced objects
-------------------------------

This code provides a single function which takes a javascript object, which may have nested objects as properties, and adds event handling methods to it which
enable events to be fired on objects and handlers to be registered that will listen to these events. Events can also be made to propagate both up and down
the object tree allowing, for example, events fired on a leaf node to be listened to by a handler that is registered on the root node.

I propose a use case for this structure to be as a model for an application whereby components can register listeners to those part of the model that they are
concerned with, but also communicate with other parts of the application by firing events on the model. This removes the need
for extra complex event handling code to be written.