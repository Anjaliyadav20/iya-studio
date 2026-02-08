import mongoose from 'mongoose';

const previousWorkSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        description: String,
        media_urls: {
            type: [String],
            required: true,
            validate: {
                validator: function (arr) {
                    return arr && arr.length > 0;
                },
                message: 'At least one media URL is required'
            }
        },
        media_type: {
            type: String,
            enum: ['image', 'video'],
            default: 'image',
        },
        service_type: {
            type: String,
        },
        event_type: {
            type: String,
            default: 'other',
        },
        location: {
            type: String,
            default: '',
        },
        is_featured: {
            type: Boolean,
            default: false,
        },
        event_date: {
            type: String,
            default: '',
        },
    },
    { timestamps: true }
);

previousWorkSchema.index({ createdAt: -1 });

export default mongoose.model('PreviousWork', previousWorkSchema);
