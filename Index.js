// install axios using npm install axios first
// run with: node Index.js
// xoxo Imp0ster

const axios = require('axios');
const fs = require('fs');
const { Writable } = require('stream');

// base ipfs url for larmfs
const baseUrl = 'https://ipfs.io/ipfs/QmZxGVewiEXBeUhJaKXNs7QmjEDU8Bqd5nCHLatek2xiHx/';

// number of tokens to get data for
// test with 10
// const numTokens = 10;
const numTokens = 6300;

// fetch the metadata for the larmf
const fetchMetadata = async (id) => {
    try {
        const response = await axios.get(`${baseUrl}${id}.json`);
        return response.data;
    } catch (error) {
        console.error(`Failed to fetch metadata for token ${id}:`, error.message);
        return null;
    }
};

// stream the larmf metadata to the json file
const fileStream = fs.createWriteStream('larmf_metadata.json');

// write the metadata to the stream
const writeMetadata = (data, isLast) => {
    if (data) {
        // put comma and new line after entry (unless end of file)
        fileStream.write(JSON.stringify(data) + (isLast ? '' : ',\n'));
    }
};

// rip it
const processTokens = async () => {
    fileStream.write('[');

    // loop through the tokens
    for (let i = 1; i <= numTokens; i++) {
        const metadata = await fetchMetadata(i);
        writeMetadata(metadata, i === numTokens);
    }

    fileStream.write(']');
    fileStream.end();
};

// ship it
processTokens();

// let us know when finished or problem
fileStream.on('finish', () => {
    console.log('Metadata retrieval complete.');
});
fileStream.on('error', (err) => {
    console.error('Error writing file:', err);
});
