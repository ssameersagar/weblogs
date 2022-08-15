import React from 'react'
import PropTypes from 'prop-types'
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';

const MyProfile = ({ auth: {user: { _id, name, avatar }} }) => {
    return (
        
        <div className="profile bg-light">
          <img src={avatar} alt="" className="round-img"/>
          <div>
              <h2>{name}</h2>
              
              <Link to={`/profile/${_id}`} className='btn btn-primary'>
                  View Profile
              </Link>
          </div>
        </div>
    )
}

MyProfile.propTypes = {
    auth: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
    auth: state.auth
});

export default connect(mapStateToProps, {})(MyProfile);
