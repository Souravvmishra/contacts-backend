const asyncHandler = require('express-async-handler')
const Contact = require("../models/contactModel");
const { Error } = require('mongoose');



// @desc :  get all contacts
// @route :  GET /api/contacts
// @access :  private

const getContacts = asyncHandler(async (req, res) => {
    const contacts = await Contact.find({user_id : req.user.id });
    res.status(200).json(contacts)
})



// @desc :  create new contacts
// @route :  POST /api/contacts
// @access :  private
const createContact = asyncHandler(async(req, res) => {
    const {name, email, phone} = req.body
    if (!name || !phone || !email ) {
        res.status(400);
        throw new Error("All Fields Are Mandatory")
    }else{
        const contact = await Contact.create({
            name,
            email,
            phone,
            user_id: req.user.id
        })
         await contact.save();
        res.status(201).json(contact)
    }

    
})




// @desc :  update contact
// @route :  PUT /api/contacts/id
// @access :  private
const updateContact = asyncHandler(async(req, res) => {
    const contact = await Contact.findById(req.params.id)
    if (!contact) {
        res.status(404)
        throw new Error("Contact Not Found")
        
    }
    if (contact.user_id.toString() !== req.user.id) {
        res.status(403)
        throw new Error("User don't have permission to update other user contacts")
        
    }
    const updatedContact = await Contact.findByIdAndUpdate(
        req.params.id,
        req.body, 
        {new : true}
    )
    res.status(201).json(updatedContact)
})



// @desc :  delete contact
// @route :  delete /api/contacts/id
// @access :  private
const deleteContact = asyncHandler(async (req, res) => {
    const contact = await Contact.findById(req.params.id)
    if (!contact) {
        res.status(404)
        throw new Error("Contact Not Found")
        
    }
    if (contact.user_id.toString() !== req.user.id) {
        res.status(403)
        throw new Error("User don't have permission to update other user contacts")
        
    }
    await Contact.findByIdAndDelete(req.params.id)
    res.status(200).json(contact)
})



// @desc :  get a contact
// @route :  GET /api/contacts/id
// @access :  private
const getContact = asyncHandler(async(req, res) => {
    const contact = await Contact.findById(req.params.id)
    if (!contact) {
        res.status(404);
        throw new Error('Contact Not Found')
        
    }
    res.status(200).json(contact)
})



module.exports = {getContacts, createContact, updateContact, deleteContact, getContact }

