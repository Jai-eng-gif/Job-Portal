import { Job } from '../models/Job.js'


export const getAllJobs = async (req, res) => {
    try {
        const jobs = await Job.find({});
        res.status(200).json(jobs);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

export const getJobById = async (req, res) => {
    try {
        const jobs = await Job.findById(req.params.id);
        if (!jobs) {
            return res.status(404).json({ message: 'Job not found' });
        }
        res.status(200).json(jobs);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

export const createJob = async (req, res) => {
    try {
        const job = new Job({ ...req.body, postedBy: req.user.id });
        await job.save()
        res.status(201).json(job);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });

    }

}

export const getJobsByCompany = async (req, res) => {
    try {
        const { company } = req.query;
        console.log(company);


        if (!company) {
            return res.status(400).json({ error: 'Company name is required' });
        }

        const jobs = await Job.find({ company: company });

        if (!jobs || jobs.length === 0) {
            return res.status(404).json({ message: 'No jobs found for this company' });
        }

        res.status(200).json(jobs);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};



export const updateJob = async (req, res) => {
    try {
        const updatedJob = await Job.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!updatedJob) {
            return res.status(404).json({ message: 'Job not found' });
        }

        res.status(200).json(updatedJob);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};


export const deleteJob = async (req, res) => {
    try {
        const deletedJob = await Job.findByIdAndDelete(req.params.id);

        if (!deletedJob) {
            return res.status(404).json({ message: 'Job not found' });
        }

        res.status(200).json({ message: 'Job deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
