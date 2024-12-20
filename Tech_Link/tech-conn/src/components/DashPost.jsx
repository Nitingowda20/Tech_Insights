import { Button, Modal, Table, TableCell } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

export default function DashPost() {
  const { currentUser } = useSelector((state) => state.user);
  const [userPost, setUserPost] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [postIdToDelete, setPostIdToDelete] = useState("");

  // console.log(userPost);

  useEffect(() => {
    const fetchpost = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/post/getpost?userId=${
            currentUser.id
          }`
        );
        const data = await res.json();
        if (res.ok) {
          setUserPost(data.posts);
          if (data.posts.length < 9) {
            setShowMore(false);
          }
        }
      } catch (error) {
        console.log(data.error);
      }
    };
    if (currentUser.isAdmin) {
      fetchpost();
    }
  }, [currentUser.id, currentUser.isAdmin]);

  const handleShowMore = async () => {
    const startIndex = userPost.length;
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/post/getpost?userId=${
          currentUser.id
        }&startIndex=${startIndex}`
      );
      const data = await res.json();
      if (res.ok) {
        setUserPost((prev) => [...prev, ...data.posts]);
        if (data.posts.length < 9) {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeletePost = async () => {
    setShowModal(false);
    try {
      const res = await fetch(
        `${
          import.meta.env.VITE_API_URL
        }/api/post/deletepost/${postIdToDelete}/${currentUser.id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );
      const data = res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        setUserPost((prev) =>
          prev.filter((posts) => posts.id !== postIdToDelete)
        );
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  return (
    <div className="w-full table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
      {currentUser.isAdmin && userPost.length > 0 ? (
        <>
          <Table hoverable className="shadow-md">
            <Table.Head>
              <Table.HeadCell>Date Updated</Table.HeadCell>
              <Table.HeadCell>Post image</Table.HeadCell>
              <Table.HeadCell>Post Title</Table.HeadCell>
              <Table.HeadCell>Category</Table.HeadCell>
              <Table.HeadCell>Delete</Table.HeadCell>
              <Table.HeadCell>
                <span>Edit</span>
              </Table.HeadCell>
            </Table.Head>

            <Table.Body className="divide-y">
              {userPost.map((posts) => (
                <Table.Row
                  key={posts.id}
                  className="bg-white dark:border-gray-700 dark:bg-gray-800"
                >
                  <Table.Cell className="font-medium text-gray-900 dark:text-white">
                    {new Date(posts.updatedAt).toLocaleDateString()}
                  </Table.Cell>

                  <Table.Cell>
                    <Link to={`/post/${posts.slug}`}>
                      <img
                        src={posts.image}
                        alt={posts.title}
                        className="w-20 h-10 object-cover bg-gray-500"
                      />
                    </Link>
                  </Table.Cell>
                  <Table.Cell>{posts.title}</Table.Cell>
                  <Table.Cell>{posts.category}</Table.Cell>
                  <Table.Cell>
                    {/* Add delete button functionality */}
                    <button
                      onClick={() => {
                        setShowModal(true);
                        setPostIdToDelete(posts.id);
                      }}
                      className="text-red-600 hover:underline cursor-pointer"
                    >
                      Delete
                    </button>
                  </Table.Cell>
                  <Table.Cell>
                    {/* Add edit functionality */}
                    <Link
                      to={`/update-post/${posts.id}`}
                      className="text-blue-600 hover:underline cursor-pointer"
                    >
                      Edit
                    </Link>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
          {showMore && (
            <button
              onClick={handleShowMore}
              className="w-full text-teal-500 py-7 self-center text-sm"
            >
              Show More
            </button>
          )}
        </>
      ) : (
        <p>you have no post </p>
      )}
      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        popup
        size="md"
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray=200 mb-4 mx-auto" />
            <h3 className="mb-5 text-lg text-gray-500">
              Are you sure you want to delete this post
            </h3>
            <div className="flex justify-center gap-9">
              <Button color="failure" onClick={handleDeletePost}>
                Yes, I'm sure
              </Button>
              <Button color="gray" onClick={() => setShowModal(false)}>
                No, Cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}
