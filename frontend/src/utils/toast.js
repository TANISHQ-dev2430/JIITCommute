import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export function showTripCreatedToast() {
  toast.success('✅ Trip successfully created!', {
    position: 'top-right',
    autoClose: 1000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: false,
    progressStyle: { background: '#7B4AE2' },
    style: {
      background: '#373535',
      color: '#fff',
      fontWeight: 500,
      fontFamily: 'Inter, sans-serif',
      fontSize: '0.95rem',
      minWidth: 0,
      maxWidth: 220,
      padding: '10px 18px',
      borderRadius: 12,
      marginTop: '10px',
      marginRight: '10px',
    },
    icon: false,
    progress: undefined,
  });
}

export function showTripAlreadyActiveToast() {
  toast.error('⚠️ You already have an active trip!', {
    position: 'top-right',
    autoClose: 1000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: false,
    progressStyle: { background: '#7B4AE2' },
    style: {
      background: '#373535',
      color: '#fff',
      fontWeight: 500,
      fontFamily: 'Inter, sans-serif',
      fontSize: '0.75rem',
      minWidth: 0,
      maxWidth: 220,
      padding: '10px 14px',
      borderRadius: 12,
      marginTop: '10px',
      marginRight: '10px',
    },
    icon: false,
    progress: undefined,
  });
}
export function showTripDeletedToast() {
  toast.success('🗑️ Trip successfully deleted!', {
    position: 'top-right',
    autoClose: 1000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: false,
    progressStyle: { background: '#7B4AE2' },
    style: {
      background: '#373535',
      color: '#fff',
      fontWeight: 500,
      fontFamily: 'Inter, sans-serif',
      fontSize: '0.95rem',
      minWidth: 0,
      maxWidth: 220,
      padding: '10px 18px',
      borderRadius: 12,
      marginTop: '10px',
      marginRight: '10px',
    },
    icon: false,
    progress: undefined,
  });
}

export function showTripJoinedSuccessToast() {
  toast.success('Joined successfully!', {
    position: 'top-center',
    autoClose: 900,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: false,
    progressStyle: { background: '#7B4AE2' },
    style: {
      background: '#232228',
      color: '#fff',
      fontWeight: 500,
      fontFamily: 'Inter, sans-serif',
      fontSize: '1rem',
      minWidth: 0,
      maxWidth: 320,
      padding: '12px 20px',
      borderRadius: 20,
      marginTop: '10px',
    },
    icon: false,
    progress: undefined,
  });
}

export function showTripAlreadyJoinedToast() {
  toast.info('ℹ️ You have already joined a trip!', {
    position: 'top-center',
    autoClose: 1000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: false,
    progressStyle: { background: '#7B4AE2' },
    style: {
      background: '#232228',
      color: '#fff',
      fontWeight: 500,
      fontFamily: 'Inter, sans-serif',
      fontSize: '1rem',
      minWidth: 0,
      maxWidth: 320,
      padding: '12px 20px',
      borderRadius: 20,
      marginTop: '10px',
    },
    icon: false,
    progress: undefined,
  });
}