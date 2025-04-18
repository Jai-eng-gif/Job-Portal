import mongoose from 'mongoose';
import bcrypt from "bcrypt";


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['jobseeker', 'employer'],
        required: true
    },
    company: {
        type: String
    }
});

userSchema.pre('save', async function(next) {
    const user=this;
    if(!user.isModified('password')) return next();
    try {
        const salt=await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(user.password, salt);
        user.password=hashedPassword;
        next()
    } catch (error) {
        return next(error)
    }
})



userSchema.methods.comparePassword = async function(Checkpassword){
    try {
        const isMatch = await bcrypt.compare(Checkpassword, this.password);
        return isMatch;
        
    } catch (error) {
        throw error;    
        
    }
}

export const User = mongoose.model('User', userSchema);
