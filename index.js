const express = require('express')
const app = express();
const Joi = require('joi')

const logger = require('./logger')

app.use(express.json())

app.use(logger)

app.use((req, res, next) => {
    console.log('Authenticating...');

    next();
})

const data = [
    {id: 1, name: 'Rakhi'}, 
    {id: 2, name: 'Bhav'},
    {id: 3, name: 'Ma'}
]

app.get('/api/data/', (req, res) => {
    res.send(data);
})

const ValidateProfile = (profile) => {
    const schema = {
        name: Joi.string().min(3).required()        
    }

    const result = Joi.validate(profile, schema)
}

app.post('/api/data/', (req, res) => {
    const {error} = ValidateProfile(req.body)
    if (error) return res.status(404).send('Invalid name');

    const profile = {
        id: 10,
        name: req.body.name
    }
    data.push(profile);
    res.send(data);
})

app.put('/data/profile/:id', (req, res) => {
    const profile = data.find(v => v.id == parseInt(req.params.id))
    if (!profile) return res.status(404).send('Profile not found');

    const {error} = ValidateProfile(req.body)
    if (error) return res.status(400).send('Invalid name');

    profile.name = req.body.name;
    res.send(profile)

})


app.delete('/api/data/:id', (req, res) => {
    const profile = data.find(v => v.id == parseInt(req.params.id))
    if (!profile) return res.status(404).send('Profile not found');

    const index = data.indexOf(profile);
    data.splice(index, 1);
    
    res.send(course);
})

app.get('/api/data/:id', (req, res) => {
    const profile = data.find(v => v.id == parseInt(req.params.id))
    if (!profile) return res.status(404).send('Profile not found');

    res.send(profile);
})

app.listen(3000, () => console.log('Listening on port 3000'))