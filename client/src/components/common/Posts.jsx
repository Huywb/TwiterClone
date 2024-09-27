import Post from "./Post";
import PostSkeleton from "../skeletons/PostSkeleton";
import { POSTS } from "../../utils/db/dummy";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

const Posts = ({feedType,username,userId}) => {

	const getPostEndPoint = ()=>{
		switch (feedType) {
			case "forYou":
				return "/api/post/all";
			case "following":
				return "/api/post/following"
			case "posts":
				return `/api/post/user/${username}`
			case "likes":
				return `/api/post/likes/${userId}`
			default:
				return "/api/post/all";
		}
	}

	const POST_ENDPOINT = getPostEndPoint()

	const{data, isLoading, refetch, isRefetching} = useQuery({
		queryKey: ["posts"],
		queryFn: async ()=>{
			try {	
				const res = await fetch(POST_ENDPOINT)
				const data = await res.json()
				if(!res.ok){
					throw new Error(data.message || "Something went wrong")
				}
				return data
			} catch (error) {
				throw new Error(error)
			}
		}
	})
	console.log('1',data)

	useEffect(()=>{
		refetch()
	},[feedType,refetch])
	return (
		<>
			{(isLoading || isRefetching) && (
				<div className='flex flex-col justify-center'>
					<PostSkeleton />
					<PostSkeleton />
					<PostSkeleton />
				</div>
			)}
			{!isLoading && data?.length === 0 && <p className='text-center my-4'>No posts in this tab. Switch 👻</p>}
			{!isLoading && data && (
				<div>
					{data?.map((post) => (
						<Post key={post._id} post={post} />
					))}
				</div>
			)}
		</>
	);
};
export default Posts;