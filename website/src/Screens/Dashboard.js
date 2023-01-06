import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { CircularProgress } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { getRestaurant } from '../Actions/restaurantActions';
import { img_endpoint } from '../config';
import { ProfileDetailsUpdateModal, ProfileImageUpdateModal } from '../Components/ProfileUpdateModals';
import defaultImg from '../Images/default-img.png';

export default function Dashboard() {
  const [openImgModal, setOpenImgModal] = useState(false);
  const [openDetailsModal, setOpenDetailsModal] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const restaurant = useSelector((state) => state.restaurant);
  const { info } = restaurant;
  const profile = useSelector((state) => state.details);
  const { info: details, loading: detailsLoading, error: detailsError } = profile;

  useEffect(() => {
    if (!info) {
      navigate('/login');
      return;
    } else {
      dispatch(getRestaurant(info.id));
    }
  }, [info, navigate, dispatch]);

  return (
    <div className="dashboard">
      <div className="container dashboard__container">
        <div className="dashboard__column dashboard__profile">
          <h2 className="dashboard__title">Profile</h2>
          <div className="dashboard__card">
            {detailsLoading && <CircularProgress />}
            {detailsError && <h3>{detailsError}</h3>}
            {details && (
              <>
                <div className="profile__img-container" onClick={() => setOpenImgModal(true)}>
                  <img src={details?.img ? img_endpoint + details?.img : defaultImg} className="profile__image" alt="profile" />
                  <div className="profile__img-edit">
                    <EditIcon />
                  </div>
                </div>
                <div className="profile__details">
                  <h3 className="profile__name">{details?.name}</h3>
                  <p>
                    <b>Email: </b>
                    {details.email}
                  </p>
                  {details.phone && (
                    <p>
                      <b>Phone: </b>+{details.phone}
                    </p>
                  )}
                  {details.address && (
                    <p>
                      <b>Address: </b>
                      {details.address}
                    </p>
                  )}
                  {details.description && (
                    <p>
                      <b>Info: </b>
                      {details.description}
                    </p>
                  )}
                </div>

                <button className="profile__edit-btn button button--small" onClick={() => setOpenDetailsModal(true)}>
                  Edit
                </button>
              </>
            )}
          </div>
        </div>
      </div>
      {details && (
        <>
          <ProfileImageUpdateModal open={openImgModal} setOpen={setOpenImgModal} img={details?.img && img_endpoint + details?.img} />
          <ProfileDetailsUpdateModal open={openDetailsModal} setOpen={setOpenDetailsModal} details={details} />
        </>
      )}
    </div>
  );
}
