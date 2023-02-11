import { Router } from "express";

const router = Router();

// INDEX
router.get('/', (req, res) => {
    console.log(req.params);
    res.json({"name": "david"});
})

// CREATE
router.post('/create', (req, res) => {
    console.log(req.params);
    res.json({"name": "david"});
})

// READ
router.get('/:id', (req, res) => {
    console.log(req.params);
    res.json({"name": "david"});
})

// UPDATE
router.put('/:id', (req, res) => {
    console.log(req.params);
    res.json({"name": "david"});
})

// DELETE
router.delete('/:id', (req, res) => {
    console.log(req.params);
    res.json({"name": "david"});
})

export default router;