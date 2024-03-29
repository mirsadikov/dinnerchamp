import { useEffect, useState } from 'react';
import { CircularProgress } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { img_endpoint } from '../config';
import { ProfileImageUpdateModal } from './ProfileImgModal';
import defaultImg from '../Images/default-img.png';
import { useDispatch, useSelector } from 'react-redux';
import { getRestaurant } from '../Actions/restaurantActions';
import { Link } from 'react-router-dom';

export default function ProfileCard({ info }) {
  const dispatch = useDispatch();

  const [openImgModal, setOpenImgModal] = useState(false);

  const profile = useSelector((state) => state.details);
  const { info: details, loading: detailsLoading, error: detailsError } = profile;

  useEffect(() => {
    if (!details && info) dispatch(getRestaurant(info.id));
  }, [dispatch, info, details]);

  return (
    <>
      <div className="dashboard__card profile">
        {detailsLoading && <CircularProgress />}
        {detailsError && <h3>{detailsError}</h3>}
        {details && (
          <>
            <div className="profile__img-container" onClick={() => setOpenImgModal(true)}>
              <img
                src={details?.img ? img_endpoint + details?.img : defaultImg}
                className="profile__image"
                alt="profile"
              />
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
            </div>

            <Link to="/dashboard/profileform" state={{ details }}>
              <button className="profile__edit-btn button button--small">Edit</button>
            </Link>
          </>
        )}
      </div>
      {details && (
        <>
          <ProfileImageUpdateModal
            open={openImgModal}
            setOpen={setOpenImgModal}
            img={details?.img && img_endpoint + details?.img}
          />
        </>
      )}
    </>
  );
}
