import os

current_dir = os.getcwd()
image_files = [f for f in os.listdir(current_dir) if os.path.isfile(os.path.join(current_dir, f)) and f.endswith('.png')]

for image_file in image_files:
  name, ext = os.path.splitext(image_file)
  new_name = name.replace("_Icon", "").replace("_", " ").lower()
  new_filename = f"{new_name}{ext}"

  print(f"From {name} To {new_name}")
  os.rename(os.path.join(current_dir, image_file), os.path.join(current_dir, new_filename))

print("이미지 파일 이름 변경 완료!")