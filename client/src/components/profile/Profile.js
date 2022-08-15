import React, {Fragment, useEffect} from 'react';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';
import Spinner from '../layout/spinner';
import { getProfileById } from '../../actions/profile';

import ProfileTop from './ProfileTop';
import ProfileAbout from './ProfileAbout';
import ProfileExp from './ProfileExp';
import ProfileGithub from './ProfileGithub';

const Profile = ({ match, getProfileById, profile: {profile, loading}, auth }) => {
    useEffect(() => {
        getProfileById(match.params.id)
    }, [getProfileById]);

    return (
        <Fragment>
            {profile === null || loading ? <Spinner /> : <Fragment>
                <Link to='/profiles' className='btn btn-light'>
                    Back to profiles
                </Link>
                {auth.isAuthenticated && auth.loading === false && auth.user._id === profile.user._id && (
                <Link to="/edit-profile" className='btn btn-dark'>
                    Edit Profile
                </Link>
                )}

                <div class="profile-grid my-1">
                    <ProfileTop profile={profile} />
                    <ProfileAbout profile={profile} />
                    <div className="profile-exp bg-white p-2">
                        <h2 className="text-primary">Experience</h2>
                        {profile.experience.length > 0 ? (
                            <Fragment>
                                {profile.experience.map(experience => (
                                    <ProfileExp 
                                        key={experience._id}
                                        experience={experience}
                                        />
                                ))}
                            </Fragment>
                        ) : (<h4>No experience credentials</h4>)}
                    </div>

                    
                        <ProfileGithub username={profile.githubuname} />
                    

                </div>
                </Fragment>}
        </Fragment>
    )
}

Profile.propTypes = {
    profile: PropTypes.func.isRequired,
    getProfileById: PropTypes.object.isRequired,
    auth: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
    profile: state.profile,
    auth: state.auth
});

export default connect(mapStateToProps, {getProfileById})(Profile);
