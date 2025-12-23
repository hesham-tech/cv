import axios from 'axios';
import { useUserStore } from '@/stores/user';
const userStore = useUserStore();
import { notifyError, notifySuccess } from './notifyService';

export const fetchItems = async apiEndpoint => {
  userStore.loadengApi = true;
  try {
    const response = await axios.get(apiEndpoint);
    console.log(`fetch ${apiEndpoint}`, response.data);
    userStore.loadengApi = false;
    return response.data;
  } catch (error) {
    console.error(`Error fetching ${apiEndpoint}`, error);
    userStore.loadengApi = false;
    throw error;
  }
};
export const fetchItem = async (apiEndpoint, id) => {
  userStore.loadengApi = true;
  try {
    const response = await axios.get(apiEndpoint, id);
    console.log(`fetch ${apiEndpoint}`, response.data);
    userStore.loadengApi = false;
    return response.data;
  } catch (error) {
    console.error(`Error fetching ${apiEndpoint}`, error);
    userStore.loadengApi = false;
    throw error;
  }
};

export const saveItems = async (apiEndpoint, data, id = false) => {
  userStore.loadengApi = true;
  try {
    let response;

    if (id) {
      // التحديث: استخدام PUT
      // Laravel يتطلب _method=put مع FormData
      if (data instanceof FormData) {
        data.append('_method', 'put');
        response = await axios.post(`${apiEndpoint}/${id}`, data);
      } else {
        response = await axios.put(`${apiEndpoint}/${id}`, data);
      }
      console.log(`update ${apiEndpoint}/${id}`, response.data);
    } else {
      // الإنشاء: استخدام POST
      response = await axios.post(apiEndpoint, data);
      console.log(`create ${apiEndpoint}`, response.data);
    }

    userStore.loadengApi = false;
    notifySuccess(`تم ${id ? 'التعديل' : 'الحفظ'} بنجاح`);
    return response.data;
  } catch (error) {
    userStore.loadengApi = false;
    console.error(`Error ${id ? 'updating' : 'creating'} ${apiEndpoint}`, error);

    // معالجة أفضل للأخطاء
    const errorMessage = error.response?.data?.message ||
      error.response?.data?.error ||
      'حدث خطأ أثناء العملية';
    notifyError(errorMessage);
    throw error;
  }
};

export const deleteItems = async (apiEndpoint, ids) => {
  userStore.loadengApi = true;
  try {
    const response = await axios.post(apiEndpoint, ids);
    console.log(`delete Items ${apiEndpoint}`, response.data);
    userStore.loadengApi = false;
    notifySuccess('تم الحذف');
    return response.data;
  } catch (error) {
    console.error(`Error delete Items ${apiEndpoint}`, error);
    userStore.loadengApi = false;
    notifyError('تعذر حذف العناصر');
    throw error;
  }
};

export const deleteItem = async (apiEndpoint, id) => {
  userStore.loadengApi = true;
  try {
    const response = await axios.delete(`${apiEndpoint}/${id}`);
    console.log(`delete Item ${apiEndpoint}`, response.data);
    userStore.loadengApi = false;
    return response.data;
  } catch (error) {
    console.error(`Error delete Item ${apiEndpoint}`, error);
    userStore.loadengApi = false;
    throw error;
  }
};
