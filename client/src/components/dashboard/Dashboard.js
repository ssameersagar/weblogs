import React, {useEffect, Fragment} from 'react';
import {Link} from 'react-router-dom';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import Spinner from '../layout/spinner';
import DashboardActions from './DashboardActions';
import Exp from './Exp';
import MyProfile from './MyProfile';
import {getCurrentProfile, deleteAccount} from '../../actions/profile';

const Dashboard = ({getCurrentProfile, deleteAccount, auth: { user }, profile: {profile, loading}}) => {
    useEffect(() => {
        getCurrentProfile();
    }, [getCurrentProfile]);

    return loading && profile === null ? (<Spinner/>) : (<Fragment>
        <h1 className="large text-primary">Dashboard</h1>
        <p className="lead">
            <i className="fas fa-user"></i> Welcome {user && user.name}
        </p>
        {profile !== null ? (<Fragment>
            <div class="bg-primary p">
                <h3>Your Profile</h3>
            </div>
            <MyProfile />
            <DashboardActions />
            <Exp experience = {profile.experience} />

            <div className="my-2">
                <button className='btn btn-danger' onClick={() => deleteAccount()}>
                    <i className="fas fa-user-minus"></i> Delete My Account
                </button>
            </div>
            

        </Fragment>) :
         (<Fragment>
             <p>You have not setup a profile, please add some info</p>
             <Link to="/create-profile" className="btn btn-primary my-1">
                 Create profile
             </Link>
         </Fragment>)}
    </Fragment>);
}

Dashboard.propTypes = {
    getCurrentProfile: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    profile: PropTypes.object.isRequired,
    deleteAccount: PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
    auth: state.auth,
    profile: state.profile
})

export default connect(mapStateToProps, {getCurrentProfile, deleteAccount})(Dashboard)