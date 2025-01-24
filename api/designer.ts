import AxiosClient from "./client";
import { getToken, decodeToken } from "./tokenStorage";
import { useMutation, useQuery } from "@tanstack/react-query";
import { IStore, IProduct, AuthResponse, SimpleResponse } from "@/types/index";

// get store profile
export const getDesignerProfile = async () => {
  const token = await getToken("accessToken");
  const response = await AxiosClient.get(`/designer/getstoreprofile`);
  return response.data;
};

//create store
export const createstore = async (storeDetails: Partial<IStore>) => {
  const token = await getToken("accessToken");
  const { userId } = decodeToken(token);
  try {
    const response = await AxiosClient.post(`/designer/setupstore`, {
      user_id: userId,
      store_name: storeDetails.storeName,
      store_description: storeDetails?.storeDescription,
    });

    return response.data;
  } catch (error) {
    console.error("Error creating store", error);
    return error.message;
  }
};

//get store inerntory
export const getStoreInventory = async (designer_id) => {
  const response = await AxiosClient.get<SimpleResponse>(
    `/designer/storeinventory/${designer_id}`
  );

  return response.data;
};

//update store profile
export const updateStoreProfileDetails = async (
  storeDetails: Partial<IStore>
) => {
  const token = await getToken("accessToken");
  const { userId } = decodeToken(token);

  const response = await AxiosClient.put<SimpleResponse>(
    `/designer/updatestoreprofile`,
    {
      store_name: storeDetails.storeName,
      store_description: storeDetails.storeDescription,
    }
  );

  return response.data;
};

//add product as a designer
export const addNewProduct = async (
  designer_id: string,
  product: Partial<IProduct>,
  images: { file: File; uri: string }[]
): Promise<SimpleResponse> => {
  try {
    const formData = new FormData();
    formData.append("designer_id", designer_id);
    formData.append("name", product.details?.name || "");
    formData.append("description", product?.details?.description || "");
    formData.append("price", String(product.details?.price || 0));
    formData.append("type", product.type || "");
    formData.append("sizes", JSON.stringify(product.sizes) || {});
    formData.append("fitpreference", product.fitPrefrence || "");
    formData.append("categories", JSON.stringify(product.categories || []));
    formData.append("quantity", String(product.details?.quantity || 0));
    formData.append("is_draft", String(product.isDraft || false));
    formData.append("is_published", String(product.isPublished || false));

    images.forEach((image, index) => {
      formData.append(`images`, {
        uri: image.file.uri,
        type: image.file.mimeType,
        name: image.file.fileName,
      });
    });

    const response = await AxiosClient.post<SimpleResponse>(
      `/designer/addnewproduct`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error adding new product:", error);
    throw error;
  }
};

//updating a single product
export const updateSingleProduct = async (product: Partial<IProduct>) => {
  const response = await AxiosClient.put<SimpleResponse>(
    `/designer/updateproduct/${product?.id}`,
    {
      designer_id: product?.designer_id,
      name: product?.name,
      description: product.description,
      sizes: product.sizes,
      price: product?.price,
      images: product.images,
      type: product.type,
      categories: product.categories,
      quantity: product?.quantity,
      is_draft: product.is_draft,
      is_published: product.is_published,
    }
  );
  return response.data;
};

export const deleteProduct = async (productId: string) => {
  const response = await AxiosClient.delete<SimpleResponse>(
    `/designer/deleteproduct/${productId}`
  );

  return response.data;
};

export const getFeaturedDesigners = async () => {
  const response = await AxiosClient.get<SimpleResponse>(
    "/designer/getfeatdesigners"
  );

  return response.data;
};

export const updateStoreImage = async (
  fileName: string,
  image: { uri: string; file: File }
): Promise<string> => {
  try {
    //using mutltipart logic to send file to backend for upload
    // Create FormData
    const formData = new FormData();
    formData.append("fileName", fileName);
    formData.append("storeImage", {
      uri: image.uri,
      name: fileName,
    });

    const response = await AxiosClient.put(
      "/designer/updatestoreimage",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error updating profile picture:", error);
    throw error;
  }
};

export const getDesignerInfo = async (designerId: string) => {
  const response = await AxiosClient.get<SimpleResponse>(
    `/designer/getdesigner/${designerId}`
  );
  return response.data;
};
