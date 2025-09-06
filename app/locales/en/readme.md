The translations files are organized in defferent files to make 
each text easy to find.

global.json

Contains global texts that cannot be categorized precisely. Application and user parameters, buttons, texts useful to multiple pages, ...

messages.json

It's used to store all messages displayed on screen to address the user.  Most of these
will be shown in a toaster.  The toaster is colored based on the type of message: error, success, 
warning, etc.


pages.json

This file holds all texts that are part of the page structure.
Titles, subtitles, intro-text. 
It also conains seo oriented texts used in the head tag like title, description, etc.



forms.json

This files contains all the text used in forms.
Labels, input placeholders, validation messages, etc.
If it's in a label, it's in there.
But, if a form makes a request that fails on the server, this error message is stored in messages.json.
The validation erros and messages stored in forms.json are dispolayed next to the 
problematic field.