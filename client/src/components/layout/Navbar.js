import React, { Fragment } from 'react';
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';
import PropTypes from 'prop-types'
import {logout} from '../../actions/auth';

const Navbar = ({auth:{isAuthenticated, loading}, logout}) => {
  const authLinks = (
    <ul>
        <li>
          <Link to='/profiles'><i class="fas fa-users"></i> Developers</Link>
        </li>
        <li>
          <Link to='/posts'><i class="fas fa-edit"></i> Posts</Link>
        </li>
        <li>
          <Link to='/dashboard'><i class="fas fa-user"></i> 
          <span className="hide-sm"> Dashboard</span></Link>
        </li>
        <li>
          <a onClick={logout} href="#!">
          <i className="fas fa-sign-out-alt"></i> 
          <span className="hide-sm"> Logout</span></a>
        </li>
      </ul>
  );

  const guestLinks = (
      <ul>
        <li>
          <Link to='/profiles'><i class="fas fa-users"></i> Developers</Link>
        </li>
       
        <li>
          <Link to='/register'><i class="fas fa-user-plus"></i> Register</Link>
        </li>
        <li>
          <Link to='/login'><i class="fas fa-sign-in-alt"></i> Login</Link>
        </li>
      </ul>
  );

    return (
        <nav className="navbar bg-dark">
      <h1>
          <Link to='/'>
          <i class="fas fa-file-code"></i> WeBlogs
          </Link>
      </h1>
      {!loading && (<Fragment>
        {isAuthenticated ? authLinks : guestLinks}
      </Fragment>) }
    </nav>
    )
}

Navbar.propTypes = {
  auth: PropTypes.func.isRequired,
  logout: PropTypes.func.isRequired
}

const mapStateToProps = state => ({
  auth: state.auth
})

export default connect(mapStateToProps, {logout})(Navbar); 