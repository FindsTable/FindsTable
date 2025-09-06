Voici la traduction en français :

Les fichiers de traduction sont organisés dans des fichiers distincts pour faciliter la recherche de chaque texte.

global.json

Contient les textes globaux ne pouvant être rangés dans une catégorie précise. 
Les paramêtre de l'application et d'utilisateurs, les boutons, les textes utiles à plusieurs pages, ...


messages.json

Il est utilisé pour stocker tous les messages affichés à l'écran pour s'adresser à l'utilisateur. La plupart de ces messages seront affichés dans une pop-up (toaster). La couleur du toaster est déterminée en fonction du type de message : erreur, succès, avertissement, etc.

pages.json

Ce fichier contient tous les textes qui font partie de la structure de la page. Titres, sous-titres, textes d'introduction. Il contient également des textes orientés SEO utilisés dans la balise head comme titre, description, etc.

forms.json

Ce fichier contient tous les textes utilisés dans les formulaires. Étiquettes, placeholders d'entrée, messages de validation, etc. Si un texte est dans une étiquette, il est dans ce fichier. Cependant, si un formulaire envoie une requête qui échoue sur le serveur, le message d'erreur est stocké dans messages.json. Les erreurs de validation et les messages stockés dans forms.json sont affichés à côté du champ problématique.