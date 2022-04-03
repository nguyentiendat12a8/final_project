const mongoose = require('mongoose')

exports.TourDraft = mongoose.model(
    'TourDraft',
    new mongoose.Schema({
        tourName: {type: String, required: true},
        destination: {
            address: {type: String, required: true},
            mainActivities: {type: String, required: true}
        },
        startingPoint: {type: String, required: true},
        picture: {type: String, required: true},
        vehicle: {type: String, required: true},
        startDate: {type: String, required: true},
        time: {type: String, required: true},
        hotel: {type: String},
        //private: {type: Boolean, required: true, default: false},
        numberOfPeople: {type: Number},
        information: {type: String, required: true},

        userID: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }],
        // categoryTourID: [{
        //     type: mongoose.Schema.Types.ObjectId,
        //     ref: 'CategoryTour'
        // }],
        // tourDraftStatusID: [{
        //     type: mongoose.Schema.Types.ObjectId,
        //     ref: 'TourDraftStatus'
        // }],
        slug: {type: String, slug: 'tourName', unique: true },
        //createdAt: { type: String, default: new Date() },
    })
)
