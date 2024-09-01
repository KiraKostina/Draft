import { ErrorMessage, Field, Form, Formik } from 'formik';
import { useState } from 'react';
import * as Yup from 'yup';
import { HiArrowUpTray } from 'react-icons/hi2';
import { HiOutlineUserCircle } from 'react-icons/hi';
import { HiOutlineEye } from 'react-icons/hi2';
import { HiOutlineEyeOff } from 'react-icons/hi';
import { updateUser, uploadPhoto } from '../../redux/auth/operations';
import { useDispatch } from 'react-redux';
import toast from 'react-hot-toast';

const validationSchema = Yup.object({
  name: Yup.string().required('Name is required'),
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  outdatedPassword: Yup.string().required('Outdated password is required'),
  newPassword: Yup.string().required('New password is required'),
  repeatNewPassword: Yup.string()
    .oneOf([Yup.ref('newPassword'), null], 'Passwords must match')
    .required('Please confirm your new password'),
});

export default function UserSettingsForm({ user, onClose }) {
  const [showOutdatedpassword, setShowOutdatedpassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showRepeatNewPassword, setShowRepeatNewPassword] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const dispatch = useDispatch();

  const initialValues = {
    gender: user?.gender || 'woman',
    name: user?.name || '',
    email: user?.email || '',
    outdatedPassword: '',
    newPassword: '',
    repeatNewPassword: '',
  };

  const handleFileChange = async event => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPhotoPreview(URL.createObjectURL(file));
      await handleUploadPhoto(file);
    }
  };

  const handleButtonClick = () => {
    document.getElementById('fileInput').click();
  };

  const handleUploadPhoto = async file => {
    if (!file) return;

    const formData = new FormData();
    formData.append('photo', file);

    dispatch(uploadPhoto(formData))
      .unwrap()
      .then(() => {
        toast.success('Photo uploaded successfully!');
      })
      .catch(() => {
        toast.error('Error uploading photo.');
      });
  };
  const handleUpdate = async (values, { setSubmitting }) => {
    // console.log('Form values:', values);
    const { gender, name, email, outdatedPassword, newPassword } = values;

    dispatch(
      updateUser({
        photo: selectedFile,
        gender,
        name,
        email,
        outdatedPassword,
        newPassword,
      })
    )
      .unwrap()
      .then(() => {
        toast.success('Profile updated successfully!');
        onClose();
      })
      .catch(() => {
        toast.error('Error updating profile.');
      })
      .finally(() => {
        setSubmitting(false);
      });
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleUpdate}
    >
      {({ isSubmitting }) => (
        <Form>
          <h3>Your photo</h3>
          <div>
            {photoPreview ? (
              <img
                // className={css.photoUrl}
                style={{
                  width: '100px',
                  height: '100px',
                  objectFit: 'cover',
                }}
                src={photoPreview}
                alt="User Photo"
              />
            ) : (
              <HiOutlineUserCircle
                style={{
                  width: '100px',
                  height: '100px',
                  objectFit: 'cover',
                }}
              />

              //   <img
              //     // className={css.photoUrl}
              //     src={<HiOutlineUserCircle />}
              //     alt="Default Preview"
              //   />
            )}
            {/* <img
              src={user?.photo || 'placeholder.jpg'}
              alt="User Photo"
              style={{ width: '100px', height: '100px', objectFit: 'cover' }}
            /> */}
            <input
              type="file"
              id="fileInput"
              style={{ display: 'none' }}
              accept="image/*"
              onChange={handleFileChange}
            />
            <button type="button" onClick={handleButtonClick}>
              <HiArrowUpTray />
              Upload a photo
            </button>
          </div>

          <h3>Your gender identity</h3>
          <div role="group" aria-labelledby="gender">
            <label>
              <Field type="radio" name="gender" value="woman" />
              Woman
            </label>
            <label>
              <Field type="radio" name="gender" value="man" />
              Man
            </label>
          </div>

          <h3>Your name</h3>
          <div>
            <Field type="text" name="name" placeholder="Enter your name" />
            <ErrorMessage name="name" component="div" className="error" />
          </div>

          <h3>E-mail</h3>
          <div>
            <Field type="email" name="email" placeholder="Enter your email" />
            <ErrorMessage name="email" component="div" className="error" />
          </div>

          <h3>Password</h3>
          <div>
            <label>
              Outdated password:
              <Field
                type={showOutdatedpassword ? 'text' : 'password'}
                name="outdatedPassword"
                placeholder="Password"
              />
              <button
                type="button"
                onClick={() => setShowOutdatedpassword(!showOutdatedpassword)}
              >
                {showOutdatedpassword ? <HiOutlineEye /> : <HiOutlineEyeOff />}
              </button>
            </label>
            <ErrorMessage
              name="outdatedPassword"
              component="div"
              className="error"
            />
          </div>

          <div>
            <label>
              New Password:
              <Field
                type={showNewPassword ? 'text' : 'password'}
                name="newPassword"
                placeholder="Password"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
              >
                {showNewPassword ? <HiOutlineEye /> : <HiOutlineEyeOff />}
              </button>
            </label>
            <ErrorMessage
              name="newPassword"
              component="div"
              className="error"
            />
          </div>

          <div>
            <label>
              Repeat New Password:
              <Field
                type={showRepeatNewPassword ? 'text' : 'password'}
                name="repeatNewPassword"
                placeholder="Password"
              />
              <button
                type="button"
                onClick={() => setShowRepeatNewPassword(!showRepeatNewPassword)}
              >
                {showRepeatNewPassword ? <HiOutlineEye /> : <HiOutlineEyeOff />}
              </button>
            </label>
            <ErrorMessage
              name="repeatNewPassword"
              component="div"
              className="error"
            />
          </div>

          <button type="submit" disabled={isSubmitting}>
            Save
          </button>
        </Form>
      )}
    </Formik>
  );
}

//// Operations для проекта обновление данных юзера
//PATCH @ /user/:userId
// export const updateUser = createAsyncThunk(
//   'user/updateUser',
//   async ({ id, photo, gender, name, email, password }, thunkAPI) => {
//     try {
//       const response = await axios.patch(
//         `/user/${id}`,
//         {
//           photo,
//           gender,
//           name,
//           email,
//           password,
//         },
//         {
//           headers: {
//             'Content-Type': 'multipart/form-data',
//           },
//         }
//       );
//       return response.data;
//     } catch (error) {
//       return thunkAPI.rejectWithValue(error.message);
//     }
//   }
// );

// export const uploadUserPhoto = createAsyncThunk(
//   'user/uploadPhoto',
//   async (formData, thunkAPI) => {
//     try {
//       const response = await axios.patch('/user/avatar', formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//         },
//       });

//       toast.success('Photo uploaded successfully!');
//       return response.data;
//     } catch (error) {
//       toast.error('Error uploading photo.');
//       return thunkAPI.rejectWithValue(error.response.data || error.message);
//     }
//   }
// );

// AUTH abo USER SLICE.js

// import {
//   register,
//   logIn,
//   logOut,
//   refreshUser,
//   updateUser,
//   uploadUserPhoto,
// } from './operations';

// .addCase(updateUser.pending, state => {
//         state.isLoading = true; // handlePending
//       })
//       .addCase(updateUser.fulfilled, (state, action) => {
// state.isLoading = false;
// state.user = action.payload;
//state.user = { ...state.user, ...payload };
//       })
//       .addCase(updateUser.rejected, (state, action) => {
//         state.isLoading = false;
//         state.error = action.payload; //handleRejected
//       })
//            .addCase(uploadUserPhoto.pending, state => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(uploadUserPhoto.fulfilled, (state, action) => {
//         state.loading = false;
//         state.user.photo = action.payload.photo;
//       })
//       .addCase(uploadUserPhoto.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       });

// try {
//   const response = await fetch('http://localhost:3000/update-user', {
//     method: 'PATCH',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify(values),
//   });

//   if (response.ok) {
//     alert('Profile updated successfully!');
//     onClose(); // Закрываем модалку после успешного обновления
//   } else {
//     const errorData = await response.json();
//     alert(`Error: ${errorData.message}`);
//   }
// } catch (error) {
//   console.error('Error updating profile:', error);
//   alert('Error updating profile.');
// } finally {
//   setSubmitting(false);
// }

// {
/* <label>
              <Field type="radio" name="gender" value="other" />
              Other
            </label> */
// }

// .test(
//   'at-least-one-field',
//   'At least one field must be filled out',
//   function (value = {}) {
//     const {
//       name,
//       email,
//       outdatedPassword,
//       newPassword,
//       repeatNewPassword,
//     } = value;
//     return (
//       !!name ||
//       !!email ||
//       !!outdatedPassword ||
//       !!newPassword ||
//       !!repeatNewPassword
//     );
//   }
// ),

// все fetch запросы перенести в редакс операции
// try {
//   const response = await fetch('http://localhost:3000/user/avatar', {
//     method: 'POST',
//     body: formData,
//   });

// алерты переделать на тостеры

//     if (response.ok) {
//       alert('Photo uploaded successfully!');
//     } else {
//       alert('Failed to upload photo.');
//     }
//   } catch (error) {
//     console.error('Error uploading photo:', error);
//     alert('Error uploading photo.');
//   }
