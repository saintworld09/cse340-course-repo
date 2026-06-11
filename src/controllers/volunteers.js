import {
    volunteerForProject as addVolunteerModel,
    removeVolunteerFromProject as removeVolunteerModel
} from '../models/volunteers.js';

export const volunteerForProject = async (req, res) => {

    const userId = req.session.user.user_id;
    const projectId = req.params.projectId;

    await addVolunteerModel(userId, projectId);

    req.flash('success', 'You are now volunteering for this project.');

    res.redirect(`/project/${projectId}`);
};

export const removeVolunteerFromProject = async (req, res) => {

    const userId = req.session.user.user_id;
    const projectId = req.params.projectId;

    await removeVolunteerModel(userId, projectId);

    req.flash('success', 'Volunteer removed successfully.');

    res.redirect(`/project/${projectId}`);
};