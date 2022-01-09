# CAPSLOCK Backend
Backend application to facilitate multi-user game interaction using web sockets

## Framework and Libraries
node.js Application
* [socket.io](http://socket.io/)
* [express.js](https://expressjs.com/) (Only used to create a small API to check if room exists)

## Concepts
* Web Sockets
  * Allow frontend client to update gameplay interactions (words entered)
  * Push game data to client-side
* Word Generation
  * Taken from list of [3000 most common words in English](https://www.ef.com/wwen/english-resources/english-vocabulary/top-3000-words/)
  * Randomization without reading entire file into memory
    * Uses a random index of number of characters in file
    * Reads 100 character chunk starting with the random index 
    * Uses the next word between 2 line feeds (`\n`)
* Dictionary Check
  * Uses [alpha wordlist](https://github.com/dwyl/english-words/)
  * Check without reading file into memory
    * Binary search of characters in file
    * Similar to word generation, uses 100 character chunk and first word to perform binary search
    * Check last word to increase efficiency
    * If word entered is between the first and last word, perform linear search
  * Possible improvement: Lexicographical based indexing (More specifically jump to a much smaller subset of words based on first character)

## Possible Improvements
* Using Redis adapter to create distributed servers for load balancing
* Some ML/NLP/DL to generate words based on a certain theme and check if certain words correspond to a theme (e.g. sports)