import multer from 'multer';

// We use memoryStorage because we don't need to save the file to our server's disk.
// We'll just hold it in memory before uploading it directly to Cloudinary.
const storage = multer.memoryStorage();

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5 MB file size limit
    },
    fileFilter: (req, file, cb) => {
        // We only want to accept PDFs for resumes
        if (file.mimetype === "application/pdf") {
            cb(null, true);
        } else {
            cb(new Error("Only .pdf format allowed!"), false);
        }
    }
});

export default upload;