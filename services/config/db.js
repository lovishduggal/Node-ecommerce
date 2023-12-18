import mongoose from 'mongoose';
export async function main() {
    await mongoose.connect(process.env.MONGODB_URL).then(() => {
        console.log('DB connected successfully');
    });
}
